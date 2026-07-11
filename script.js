const SUPABASE_URL = "https://itnjegwjltlnkbgjqgsa.supabase.co";
const SUPABASE_KEY = "sb_publishable_GhWWWi0KCrBaixNtkm2nAQ_ijWxWuFd";

const client = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

async function addThread() {
  const title = document.getElementById("title").value;

  if (!title) return;

  await client
    .from("threads")
    .insert({
      title: title
    });

  document.getElementById("title").value = "";

  loadThreads();
}

async function loadThreads() {
  const { data } = await client
    .from("threads")
    .select("*")
    .order("created_at", { ascending: false });

  const area = document.getElementById("threads");

  area.innerHTML = "";

  data.forEach(thread => {
    area.innerHTML += `
      <div>
        <h3>${thread.title}</h3>
        <button>賛成</button>
        <button>反対</button>
      </div>
    `;
  });
}

loadThreads();