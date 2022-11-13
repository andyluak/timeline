import React, { useState } from "react";

function FolderTab() {
  const [activeTab, setActiveTab] = useState("text");

  const handleTabSelection = (e) => {
    setActiveTab(e.target.id);
    const button = document.getElementsByClassName("tab");

    // Remove all active classes
    for (let i = 0; i < button.length; i++) {
      button[i].classList.remove("active");
    }
    // Add active class to the current/clicked button
    e.currentTarget.className += " active";
  };
  return (
    <>
      <div class="folder">
        <div class="tabs">
          <button class="tab text" onClick={handleTabSelection}>
            <div>
              <span id="text">Text</span>
            </div>
          </button>
          <button class="tab mdx" onClick={handleTabSelection}>
            <div>
              <span id="mdx">MDX</span>
            </div>
          </button>
        </div>
        <div class="content">
          <div class="content__inner" id="tab-1">
            <div class="page">
              <p>
                Productize. Optics accountable talk. Thought shower. High
                performance keywords market-facing drink from the firehose, or
                you better eat a reality sandwich before you walk back in that
                boardroom, but accountable talk knowledge process outsourcing.{" "}
              </p>
              <p>
                What's our go to market strategy? cross functional teams enable
                out of the box brainstorming nor zeitgeist viral engagement.
                Deep dive. Organic growth quick sync, feed the algorithm.{" "}
              </p>
            </div>
          </div>
          <div class="content__inner" id="tab-2">
            <div class="page">
              <p>
                I love cheese, especially the big cheese gouda. Monterey jack
                red leicester roquefort cheese and wine fromage frais smelly
                cheese melted cheese dolcelatte. Fromage smelly cheese manchego
                paneer cheese and wine danish fontina macaroni cheese red
                leicester.{" "}
              </p>
              <p>
                Stilton fondue queso emmental when the cheese comes out
                everybody's happy croque monsieur queso paneer. Say cheese
                pecorino swiss boursin halloumi cottage cheese taleggio boursin.{" "}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default FolderTab;
