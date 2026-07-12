const SUPABASE_URL = "https://itnjegwjltlnkbgjqgsa.supabase.co";

const SUPABASE_KEY = "sb_publishable_GhWWWi0KCrBaixNtkm2nAQ_ijWxWuFd";


const client = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);


const threadInput = document.getElementById("threadInput");
const addButton = document.getElementById("addButton");

const threadList = document.getElementById("threadList");
const completedList = document.getElementById("completedList");

const votingTab = document.getElementById("votingTab");
const completedTab = document.getElementById("completedTab");
const completedPage = document.getElementById("completedPage");


function getVote(threadId){

  return localStorage.getItem(
    "vote_" + threadId
  );

}


function setVote(threadId, vote){

  localStorage.setItem(
    "vote_" + threadId,
    vote
  );

}


function removeVote(threadId){

  localStorage.removeItem(
    "vote_" + threadId
  );

}


// 投票中一覧

async function loadThreads(){

  const { data, error } = await client
    .from("threads")
    .select("*")
    .eq("completed", false)
    .order("created_at", { ascending:false });


  if(error){
    alert(error.message);
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
        👍 ${thread.agree_count ?? 0}
        👎 ${thread.disagree_count ?? 0}
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



// 👍

card.querySelector(".agree").onclick = async () => {


  const oldVote = getVote(thread.id);


  if(oldVote === "agree"){
    return;
  }


  const updates = {

    agree_count: (thread.agree_count ?? 0) + 1

  };


  if(oldVote === "disagree"){

    updates.disagree_count =
      (thread.disagree_count ?? 0) - 1;

  }


  const { error } = await client
    .from("threads")
    .update(updates)
    .eq("id", thread.id);


  if(error){
    alert(error.message);
    return;
  }


  setVote(thread.id,"agree");


  loadThreads();

};



    card.querySelector(".disagree").onclick = async () => {


  const oldVote = getVote(thread.id);


  if(oldVote === "disagree"){
    return;
  }


  const updates = {

    disagree_count: (thread.disagree_count ?? 0) + 1

  };


  if(oldVote === "agree"){

    updates.agree_count =
      (thread.agree_count ?? 0) - 1;

  }


  const { error } = await client
    .from("threads")
    .update(updates)
    .eq("id", thread.id);


  if(error){
    alert(error.message);
    return;
  }


  setVote(thread.id,"disagree");


  loadThreads();

};


    // 対応完了

const completeButton = card.querySelector(".complete-button");

completeButton.addEventListener("click", async (e) => {

  e.stopPropagation();

  const { error } = await client
    .from("threads")
    .update({
      completed: true,
      completed_at: new Date().toISOString()
    })
    .eq("id", thread.id);

  if(error){
    alert(error.message);
    return;
  }

  loadThreads();

});




    threadList.appendChild(card);


  });

}



// 対応済み一覧

async function loadCompletedThreads(){


  const { data, error } = await client
    .from("threads")
    .select("*")
    .eq("completed", true)
    .order("completed_at", { ascending:false });


  if(error){
    alert(error.message);
    return;
  }


  completedList.innerHTML = "";


  data.forEach(thread => {


    const card = document.createElement("div");


    card.className = "thread-card";


    card.innerHTML = `

      <div class="thread-title">
        💠 ${thread.title}
      </div>


      <div class="counts">
        👍 ${thread.agree_count ?? 0}
        👎 ${thread.disagree_count ?? 0}
      </div>


      <div>
        対応日時：
        ${new Date(thread.completed_at).toLocaleString()}
      </div>

    `;


    completedList.appendChild(card);


  });

}



// スレ追加

addButton.onclick = async () => {


  const title = threadInput.value.trim();


  if(!title){
    return;
  }


  const { error } = await client
    .from("threads")
    .insert([
      {
        title:title,
        agree_count:0,
        disagree_count:0,
        completed:false
      }
    ]);


  if(error){
    alert(error.message);
    return;
  }


  threadInput.value = "";


  loadThreads();

};



// タブ切り替え

// タブ切り替え

votingTab.onclick = () => {

  threadList.style.display = "block";
  completedPage.style.display = "none";

  votingTab.classList.add("active");
  completedTab.classList.remove("active");

  loadThreads();

};



completedTab.onclick = () => {

  threadList.style.display = "none";
  completedPage.style.display = "block";

  completedTab.classList.add("active");
  votingTab.classList.remove("active");

  loadCompletedThreads();

};


// 起動

loadThreads();

