
const admin = {
  apps: [],
  initializeApp: jest.fn(),
  credential: { cert: jest.fn() },
  auth: jest.fn(() => ({
    createUser: jest.fn(),
    getUser: jest.fn(),
    verifyIdToken: jest.fn(),
  })),
  firestore: jest.fn(() => ({
    collection: jest.fn(() => ({
      doc: jest.fn(() => ({
        set: jest.fn(),
        get: jest.fn(() => ({ data: jest.fn() })),
      })),
    })),
  })),
  storage: jest.fn(() => ({
    bucket: jest.fn(() => ({
      upload: jest.fn(),
      file: jest.fn(() => ({
        save: jest.fn(),
      })),
    })),
  })),
};

module.exports = admin;
