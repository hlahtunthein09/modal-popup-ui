// modal window project



const buttons = document.querySelectorAll(".header .modal");
const contents = document.querySelectorAll(".window > div"); // content, content2, content3
const exits = document.querySelectorAll(".exit");
const overlay = document.querySelector(".window"); 

let activeStack = []; // stack of opened modals
let zIndexBase = 100; // starting z-index


// contents.forEach(c => {
//     c.style.visibility = "hidden";
// });


buttons.forEach((btn, index) => {
    btn.addEventListener("click", () =>{
        const modal = contents[index];

        // 1. Prevent re-opening if modal is already the top one
        if(activeStack.length && activeStack[activeStack.length - 1] === modal)
        {
            console.log("Already active on top, no action taken.");
            return;
        }

        // 2. Bring modal to front if already in stack but not top
        if(activeStack.includes(modal))
        {
            bringToFront(modal);
            return;
        }

        // 3. Otherwise, open new modal
        openModal(modal, btn);
    });
});


// ================= FUNCTIONS =================//

//open modal
function openModal(modal, triggerBtn)
{
    modal.classList.remove("close");
    modal.style.visibility = "visible";
    modal.classList.add("active");

    // copied
    if (triggerBtn) {
    triggerBtn.disabled = true;
    modal.addEventListener("animationend", () => {
        triggerBtn.disabled = false;
    }, { once: true });
    }

    //put on top

    const newZ =    zIndexBase + activeStack.length;
    modal.style.zIndex = newZ;

    activeStack.push(modal);
}

// bring an existing modal to top
function bringToFront(modal)
{
    // remove from stack and re-push at top
    activeStack = activeStack.filter((m) => m !== modal);
    activeStack.push(modal);

    // update z-indexes
    activeStack.forEach((m, i) => {
        m.style.zIndex = zIndexBase + i;
    });
}


// close only the top modal (or specific one if passed)
function closeTopModal(modal = null)
{
    if(!activeStack.length) return;

    const topModal = modal || activeStack[activeStack.length - 1];

    topModal.classList.remove("active");
    topModal.classList.add("close");

    topModal.addEventListener("animationend", ()=>{

        if(topModal.classList.contains("close"))
        {
            const exitBtn = topModal.querySelector(".exit");
    if (exitBtn) {
      console.log("Before hiding modal — Exit visible:", getComputedStyle(exitBtn).display);
    }


            topModal.style.visibility = "hidden";
            topModal.classList.remove("close");
            
     if (exitBtn) {
      console.log("After hiding modal — Exit visible:", getComputedStyle(exitBtn).display);
    }
            // remove from stack
            activeStack = activeStack.filter((m) => m !== topModal);

            // reassign z-index in case we closed middle one
            activeStack.forEach((m, i) => {
                m.style.zIndex = zIndexBase + i;
            });
        }
    }, { once: true });
}

// close modal on exit button
exits.forEach((exitBtn) => {
    exitBtn.addEventListener("click", (e) =>{
        const modal = e.target.closest(".content, .content2, .content3");
        closeTopModal(modal);
    });
});

// close modal on Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeTopModal();
  }
});

// close modal when clicking anywhere outside ALL open modals
document.addEventListener("click", (e) => {
  if (!activeStack.length) return;

  // ignore clicks on the header buttons
  if (e.target.closest(".header .modal")) return;

  // if the click is not inside any open modal, close the top one
  const clickedInsideAny = activeStack.some(m => m.contains(e.target));
  if (!clickedInsideAny) {
    closeTopModal();
  }
});


