/// <reference types="chrome"/>

console.log('Background script loaded');

// 创建定时清理任务
chrome.alarms.create('cookieCleanup', { periodInMinutes: 30 });

// 预加载和缓存 cookies 数据
async function cacheCookies() {
  try {
    const allCookies = await chrome.cookies.getAll({});
    await chrome.storage.local.set({ 
      cachedCookies: allCookies,
      lastUpdateTime: Date.now()
    });
    console.log('Cookies cached successfully');
  } catch (error) {
    console.error('Failed to cache cookies:', error);
  }
}

// 定期清理 cookies
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
    
    // 更新缓存
    await cacheCookies();
  }
});

// 监听 cookie 变化并更新缓存
chrome.cookies.onChanged.addListener(async (changeInfo) => {
  await cacheCookies();
});

// 点击扩展图标时预加载数据
chrome.action.onClicked.addListener(async (tab) => {
  // 预加载数据
  await cacheCookies();
  // 打开侧边栏
  chrome.sidePanel.open({ windowId: tab.windowId });
});

// 安装或更新时的初始化
chrome.runtime.onInstalled.addListener(async () => {
  // 设置侧边栏
  chrome.sidePanel.setOptions({
    enabled: true,
    path: 'index.html'
  });
  
  // 初始化缓存
  await cacheCookies();
  
  // 可以添加其他初始化逻辑
  await chrome.storage.local.set({
    settings: {
      enableAutoCleaning: false,
      cleaningDelay: 30,
      enableTabCleanup: false,
      enableDomainChangeCleanup: false,
      enableGraylistCleanup: false,
      cleanOpenTabsOnStartup: false
    }
  });
});

// 定期更新缓存（每5分钟）
chrome.alarms.create('updateCache', { periodInMinutes: 5 });
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'updateCache') {
    cacheCookies();
  }
});

export {}; 