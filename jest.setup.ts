import '@testing-library/jest-dom';

// Polyfill fetch nếu chưa có trong jsdom
if (!global.fetch) {
  global.fetch = jest.fn();
}
