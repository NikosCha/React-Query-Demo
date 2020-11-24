const items = [];

export const getItems = async () => {
  await new Promise((r) => setTimeout(r, 4000));

  return Promise.resolve({
    ts: Date.now(),
    items,
  });
};

export const createItem = async (text) => {
  await new Promise((r) => setTimeout(r, 1000));

  // sometimes it will fail, this will cause a regression on the UI

  if (Math.random() > 0.7) {
    throw new Error('Item was not added');
  }

  items.push(text);
  return;
};
