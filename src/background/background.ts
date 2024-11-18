/// <reference types="chrome"/>

console.log('Background script loaded');

chrome.alarms.create('cookieCleanup', { periodInMinutes: 30 });

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === 'cookieCleanup') {
    const { whiteList = [] } = await chrome.storage.local.get('whiteList');
    const allCookies = await chrome.cookies.getAll({});
    
    for (const cookie of allCookies) {
      const cookieId = `${cookie.domain}:${cookie.name}`;
      if (!whiteList.includes(cookieId)) {
        await chrome.cookies.remove({
          url: `http${cookie.secure ? 's' : ''}://${cookie.domain}${cookie.path}`,
          name: cookie.name,
        });
      }
    }
  }
});

chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.open({ windowId: tab.windowId });
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel.setOptions({
    enabled: true,
    path: 'index.html'
  });
});

export {}; 