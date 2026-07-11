const SUPABASE_URL = "https://itnjegwjltlnkbgjqgsa.supabase.co";

const SUPABASE_KEY = "sb_publishable_GhWWWi0KCrBaixNtkm2nAQ_ijWxWuFd";


const client = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);



const threadInput = document.getElementById("threadInput");
const addButton = document.getElementById("addButton");
const threadList = document.getElementById("threadList");



async function loadThreads(){

  const { data, error } = await client
    .from("threads")
    .select("*")
    .order("created_at", { ascending:false });


  if(error){
    console.log(error);
    return;
  }


  threadList.innerHTML = "";


  data.forEach(thread => {

    const card = document.createElement("div");

    card.className = "thread-card";


    card.innerHTML = `
  <div class="thread-title">
    💠 ${thread.title}
  </div>

  <div class="counts">
    👍 ${thread.agree_count}
    👎 ${thread.disagree_count}
  </div>

  <div class="vote-area">
    <button class="vote-button agree">
      👍 賛成
    </button>

    <button class="vote-button disagree">
      👎 反対
    </button>
  </div>

  <button class="complete-button">
    対応完了
  </button>
`;

card.querySelector(".agree").onclick = async () => {

  await client
    .from("threads")
    .update({
      agree_count: thread.agree_count + 1
    })
    .eq("id", thread.id);

  loadThreads();

};


card.querySelector(".disagree").onclick = async () => {

  await client
    .from("threads")
    .update({
      disagree_count: thread.disagree_count + 1
    })
    .eq("id", thread.id);

  loadThreads();

};


    threadList.appendChild(card);

  });

}



addButton.onclick = async () => {

  const title = threadInput.value.trim();


  if(!title){
    return;
  }


  await client
    .from("threads")
    .insert([
      {
        title:title
      }
    ]);


  threadInput.value = "";


  loadThreads();

};



loadThreads();