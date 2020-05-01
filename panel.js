const init = () => {
  const $ytslList = document.querySelector(".list");

  const setUpMessaging = (tabs) => {
    browser.tabs.sendMessage(tabs[0].id, {
      command: "get-timestamps",
    });

    browser.runtime.onMessage.addListener((message) => {
      if (message.command === "timestamps") {
        message.timestamps.forEach((item) => {
          const $li = document.createElement("li");
          $li.classList.add("item");
          $li.innerText = item[0];
          $ytslList.append($li);

          $li.addEventListener("click", () => {
            const splitResult = item[1].split(":");
            let date;
            let hours;
            let minutes;
            let seconds;

            if (splitResult.length === 3) {
              [hours, minutes, seconds] = splitResult;
              date = new Date(0, 0, 0, hours || 0, minutes || 0, seconds || 0);
            } else if (splitResult.length === 2) {
              [minutes, seconds] = splitResult;
              date = new Date(0, 0, 0, 0, minutes || 0, seconds || 0);
            }
            const target =
              date.getHours() * 60 * 60 +
              date.getMinutes() * 60 +
              date.getSeconds();

            browser.tabs.sendMessage(tabs[0].id, {
              command: "seek-to",
              target,
            });
          });
        });
        console.log($ytslList);
      }
    });
  };

  browser.tabs
    .query({ active: true, currentWindow: true })
    .then(setUpMessaging);
  // .catch(reportError);
};

browser.tabs.executeScript({ file: "/content_scripts/index.js" }).then(init);
// .catch(reportExecuteScriptError);
