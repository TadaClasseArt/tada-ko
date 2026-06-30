/* ---- Configuration Supabase ---- */
const SUPABASE_URL = "https://jiwnhpyugybtazlkgmma.supabase.co";
const SUPABASE_KEY = "sb_publishable_-fKWzD2wlQ92Js9-rRc_3g_Gjjj8uUz";

const LANG = (document.documentElement.lang || "fr").slice(0,2);
const TXT = {
  fr: {
    required: "Merci de remplir les champs obligatoires.",
    sending: "Envoi…", send: "Envoyer",
    err: "Une erreur est survenue. Merci de réessayer.",
    ok: "Merci ! Votre message a bien été envoyé.",
    signingIn: "Connexion…", signIn: "Se connecter",
    badCreds: "Identifiants incorrects.",
    resErr: "Impossible de charger les ressources.",
    resEmpty: "Aucune ressource pour le moment.",
    open: "Ouvrir"
  },
  en: {
    required: "Please fill in the required fields.",
    sending: "Sending…", send: "Send",
    err: "Something went wrong. Please try again.",
    ok: "Thank you! Your message has been sent.",
    signingIn: "Signing in…", signIn: "Log in",
    badCreds: "Incorrect credentials.",
    resErr: "Unable to load the resources.",
    resEmpty: "No resources yet.",
    open: "Open"
  }
};
const t = TXT[LANG] || TXT.fr;

let sb = null;
function getClient(){
  if(!sb && window.supabase){ sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY); }
  return sb;
}

document.addEventListener("DOMContentLoaded", function(){
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if(toggle && links){ toggle.addEventListener("click", function(){ links.classList.toggle("open"); }); }

  const form = document.getElementById("contact-form");
  if(form){
    form.addEventListener("submit", async function(e){
      e.preventDefault();
      const msg = document.getElementById("contact-msg");
      const btn = form.querySelector("button[type=submit]");
      const data = {
        first_name: form.first_name.value.trim(),
        last_name: form.last_name.value.trim(),
        email: form.email.value.trim(),
        message: form.message.value.trim()
      };
      if(!data.first_name || !data.email || !data.message){
        msg.textContent = t.required; msg.className = "form-msg err"; return;
      }
      btn.disabled = true; btn.textContent = t.sending;
      let ok = false;
      try {
        const res = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify({
            access_key: "5851cbef-f0a8-4c15-9a6a-36c39b2e1678",
            subject: "Nouvelle demande de contact - tada-ko.fr",
            from_name: "Site tada-ko",
            name: (data.first_name + " " + data.last_name).trim(),
            email: data.email,
            message: data.message
          })
        });
        const json = await res.json();
        ok = json.success;
      } catch(err){ console.error(err); }
      try { await getClient().from("contact_messages").insert([data]); } catch(e){ console.error(e); }
      btn.disabled = false; btn.textContent = t.send;
      if(ok){ form.reset(); msg.textContent = t.ok; msg.className = "form-msg ok"; }
      else { msg.textContent = t.err; msg.className = "form-msg err"; }
    });
  }

  if(document.getElementById("login-form")){ initProAccess(); }
});

async function initProAccess(){
  const client = getClient();
  const loginForm = document.getElementById("login-form");
  const loginBox = document.getElementById("login-box");
  const proContent = document.getElementById("pro-content");
  const loginMsg = document.getElementById("login-msg");
  const logoutBtn = document.getElementById("logout-btn");

  async function refresh(){
    const { data:{ session } } = await client.auth.getSession();
    if(session){
      loginBox.classList.add("hidden"); proContent.classList.remove("hidden");
      const who = document.getElementById("pro-user"); if(who) who.textContent = session.user.email;
      loadResources();
    } else { loginBox.classList.remove("hidden"); proContent.classList.add("hidden"); }
  }
  async function loadResources(){
    const list = document.getElementById("res-list"); if(!list) return;
    const { data, error } = await client.from("pro_resources").select("*").order("sort_order");
    if(error){ list.innerHTML = "<p class='muted'>"+t.resErr+"</p>"; return; }
    if(!data || !data.length){ list.innerHTML = "<p class='muted'>"+t.resEmpty+"</p>"; return; }
    list.innerHTML = data.map(function(r){
      const link = (r.url && r.url !== "#") ? "<a class='btn' style='margin-top:10px' href='"+r.url+"' target='_blank' rel='noopener'>"+t.open+"</a>" : "";
      return "<div class='res-card'><div class='rcat'>"+(r.category||"")+"</div><h3>"+r.title+"</h3><p class='muted'>"+(r.description||"")+"</p>"+link+"</div>";
    }).join("");
  }
  loginForm.addEventListener("submit", async function(e){
    e.preventDefault(); loginMsg.textContent = "";
    const email = loginForm.email.value.trim(); const password = loginForm.password.value;
    const btn = loginForm.querySelector("button[type=submit]");
    btn.disabled = true; btn.textContent = t.signingIn;
    const { error } = await client.auth.signInWithPassword({ email, password });
    btn.disabled = false; btn.textContent = t.signIn;
    if(error){ loginMsg.textContent = t.badCreds; loginMsg.className = "form-msg err"; }
    else { loginMsg.textContent = ""; refresh(); }
  });
  if(logoutBtn){ logoutBtn.addEventListener("click", async function(){ await client.auth.signOut(); refresh(); }); }
  refresh();
}
