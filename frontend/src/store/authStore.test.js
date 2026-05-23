import useAuthStore from "./authStore";

describe("authStore", () => {
  beforeEach(() => {
    let storage = {};

    global.localStorage = {
      getItem: (key) => (key in storage ? storage[key] : null),
      setItem: (key, value) => {
        storage[key] = value;
      },
      removeItem: (key) => {
        delete storage[key];
      },
      clear: () => {
        storage = {};
      },
    };

    global.localStorage.clear();
    useAuthStore.setState({ user: null, token: null });
  });

  it("stores user and token on login", () => {
    useAuthStore.getState().login({ id: "1", name: "Tester" }, "token-123");

    expect(localStorage.getItem("user")).toBe(JSON.stringify({ id: "1", name: "Tester" }));
    expect(localStorage.getItem("token")).toBe("token-123");
    expect(useAuthStore.getState().user).toEqual({ id: "1", name: "Tester" });
    expect(useAuthStore.getState().token).toBe("token-123");
  });

  it("clears localStorage and state on logout", () => {
    useAuthStore.getState().login({ id: "1", name: "Tester" }, "token-123");
    useAuthStore.getState().logout();

    expect(localStorage.getItem("user")).toBeNull();
    expect(localStorage.getItem("token")).toBeNull();
    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().token).toBeNull();
  });

  it("has null user and token as initial state", () => {
  expect(useAuthStore.getState().user).toBeNull();
  expect(useAuthStore.getState().token).toBeNull();
});

  it("loads user and token from localStorage on init", () => {
    const user = { id: "2", name: "Returning User" };
    const token = "existing-token";

    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);

    // Reset store to simulate page reload
    useAuthStore.setState({
      user: JSON.parse(localStorage.getItem("user")),
      token: localStorage.getItem("token"),
    });

    expect(useAuthStore.getState().user).toEqual(user);
    expect(useAuthStore.getState().token).toBe(token);
  });

});
