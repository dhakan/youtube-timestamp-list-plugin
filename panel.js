const $list = document.querySelector(".list");

const handleActiveTab = (tabs) => {
  const activeTab = tabs[0];

  const onListItemClicked = (item) => {
    browser.tabs.sendMessage(activeTab.id, {
      command: "seek-to",
      target: item.ts,
    });
  };

  const createListItem = (timestamp) => {
    console.log(timestamp, timestamp.paragraph)
    const $li = document.createElement("li");
    $li.classList.add("item");
    $li.innerText = timestamp.paragraph;
    $list.append($li);

    $li.addEventListener("click", () => onListItemClicked(timestamp));
  };

  const onMessage = (message) => {
    console.log("heey");
    if (message.command === "timestamps") {
      const { timestamps } = message;

      Array.from(timestamps.values()).forEach((timestamp) =>
        createListItem(timestamp)
      );
    }
  };

  browser.runtime.onMessage.addListener(onMessage);
  browser.tabs.sendMessage(activeTab.id, {
    command: "get-timestamps",
  });
};

browser.tabs.query({ active: true, currentWindow: true }).then(handleActiveTab);
// .catch(reportError);
