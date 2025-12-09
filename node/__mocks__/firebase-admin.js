// mocks/firebase-admin.js
const adminMock = {
  apps: [],
  initializeApp: jest.fn(),
  credential: { cert: jest.fn() },
  auth: jest.fn(() => ({
    createUser: jest.fn(() => Promise.resolve({ uid: 'mock-user' })),
    getUser: jest.fn(() => Promise.resolve({ uid: 'mock-user' })),
    verifyIdToken: jest.fn(() => Promise.resolve({ uid: 'mock-user' })),
  })),
  firestore: jest.fn(() => ({
    collection: jest.fn((name) => ({
      doc: jest.fn((id) => ({
        get: jest.fn(() => Promise.resolve({ data: () => ({ id, name: 'Mock Item', price: 100 }) })),
        set: jest.fn(() => Promise.resolve()),
        update: jest.fn(() => Promise.resolve()),
        delete: jest.fn(() => Promise.resolve()),
      })),
      get: jest.fn(() =>
        Promise.resolve({
          docs: [
            { data: () => ({ id: '1', name: 'Mock Item 1', price: 50 }) },
            { data: () => ({ id: '2', name: 'Mock Item 2', price: 75 }) },
          ],
        })
      ),
    })),
  })),
  storage: jest.fn(() => ({
    bucket: jest.fn(() => ({
      upload: jest.fn(() => Promise.resolve()),
      file: jest.fn(() => ({
        save: jest.fn(() => Promise.resolve()),
      })),
    })),
  })),
};

// Mock services for easier imports in code
const auth = adminMock.auth();
const firestore = adminMock.firestore();
const storage = adminMock.storage();

module.exports = {
  admin: adminMock,
  auth,
  firestore,
  storage,
};




