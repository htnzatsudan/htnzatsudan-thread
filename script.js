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

card.querySelector(".complete-button").onclick = async () => {

  if(!confirm("このスレッドを対応完了にしますか？")){
    return;
  }

  if(!confirm("本当に対応完了にしますか？")){
    return;
  }

  await client
    .from("threads")
    .update({
      completed: true,
      completed_at: new Date()
    })
    .eq("id", thread.id);

  loadThreads();

};

card.querySelector(".agree").onclick = async () => {

  const { error } = await client
  .from("threads")
  .update({
    agree_count: thread.agree_count + 1
  })
  .eq("id", thread.id);

if(error){
  alert(error.message);
  return;
}

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


  const { error } = await client
  .from("threads")
  .insert([
    {
      title:title
    }
  ]);

if(error){
  alert(error.message);
  return;
}


  threadInput.value = "";


  loadThreads();

};


