const {
  createIssue,
  getIssues,
  getIssue,
  updateIssue,
  deleteIssue,
  getIssueCounts,
} = require("../controllers/issueController");
const Issue = require("../models/Issue");

jest.mock("../models/Issue");

describe("issueController", () => {
  let res;

  beforeEach(() => {
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    jest.clearAllMocks();
  });

  it("creates an issue successfully", async () => {
    const mockIssue = { _id: "1", title: "Test issue" };
    Issue.create.mockResolvedValue(mockIssue);

    await createIssue(
      { body: { title: "Test issue", description: "Desc", priority: "High", severity: "Major" }, user: { id: "user-1", email: "user@test.com" } },
      res
    );

    expect(Issue.create).toHaveBeenCalledWith({
      title: "Test issue",
      description: "Desc",
      priority: "High",
      severity: "Major",
      createdBy: "user-1",
      activityLog: [{ message: "Issue created", by: "user@test.com" }],
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockIssue);
  });

  it("returns paginated issues", async () => {
    const mockIssue = { _id: "1", title: "Search issue" };
    Issue.countDocuments.mockResolvedValue(1);
    const findChain = {
      populate: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue([mockIssue]),
    };
    Issue.find.mockReturnValue(findChain);

    await getIssues(
      {
        query: { search: "Search", priority: "High", status: "Open", page: "2", limit: "5" },
      },
      res
    );

    expect(Issue.countDocuments).toHaveBeenCalledWith({
      title: { $regex: "Search", $options: "i" },
      priority: "High",
      status: "Open",
    });
    expect(findChain.skip).toHaveBeenCalledWith(5);
    expect(findChain.limit).toHaveBeenCalledWith(5);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      issues: [mockIssue],
      total: 1,
      page: 2,
      totalPages: 1,
    });
  });

  it("returns 404 when requested issue does not exist", async () => {
    const findByIdChain = {
      populate: jest.fn().mockResolvedValue(null),
    };
    Issue.findById.mockReturnValue(findByIdChain);

    await getIssue({ params: { id: "missing" } }, res);

    expect(findByIdChain.populate).toHaveBeenCalledWith("createdBy", "name email");
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Issue not found" });
  });

  it("updates an issue and logs status changes", async () => {
    const issue = {
      _id: "1",
      title: "Old title",
      description: "Old desc",
      priority: "Low",
      severity: "Minor",
      status: "Open",
      activityLog: [],
      save: jest.fn().mockResolvedValue(true),
    };
    Issue.findById.mockResolvedValue(issue);

    await updateIssue(
      {
        params: { id: "1" },
        body: { title: "New title", description: "New desc", priority: "High", severity: "Major", status: "Resolved" },
        user: { email: "editor@test.com" },
      },
      res
    );

    expect(issue.activityLog).toEqual([
      { message: "Status changed from Open to Resolved", by: "editor@test.com" },
      { message: "Priority changed from Low to High", by: "editor@test.com" },
    ]);
    expect(issue.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(issue);
  });

  it("deletes an issue and returns a success message", async () => {
    Issue.findByIdAndDelete.mockResolvedValue({ _id: "1" });

    await deleteIssue({ params: { id: "1" } }, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "Issue deleted successfully" });
  });

  it("returns issue counts from aggregation", async () => {
    Issue.aggregate.mockResolvedValue([{ _id: "Open", count: 3 }]);

    await getIssueCounts({}, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([{ _id: "Open", count: 3 }]);
  });

  it("returns a single issue when found", async () => {
  const mockIssue = { _id: "1", title: "Found issue" };
  const findByIdChain = {
    populate: jest.fn().mockResolvedValue(mockIssue),
  };
  Issue.findById.mockReturnValue(findByIdChain);

  await getIssue({ params: { id: "1" } }, res);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith(mockIssue);
});

it("returns 404 when updating an issue that does not exist", async () => {
  Issue.findById.mockResolvedValue(null);

  await updateIssue(
    {
      params: { id: "missing" },
      body: { title: "New title" },
      user: { email: "editor@test.com" },
    },
    res
  );

  expect(res.status).toHaveBeenCalledWith(404);
  expect(res.json).toHaveBeenCalledWith({ message: "Issue not found" });
});

it("returns 404 when deleting an issue that does not exist", async () => {
  Issue.findByIdAndDelete.mockResolvedValue(null);

  await deleteIssue({ params: { id: "missing" } }, res);

  expect(res.status).toHaveBeenCalledWith(404);
  expect(res.json).toHaveBeenCalledWith({ message: "Issue not found" });
});

it("returns 500 on server error when creating issue", async () => {
  Issue.create.mockRejectedValue(new Error("DB error"));

  await createIssue(
    {
      body: { title: "Test", description: "Desc", priority: "High", severity: "Major" },
      user: { id: "user-1", email: "user@test.com" },
    },
    res
  );

  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.json).toHaveBeenCalledWith({
    message: "Server error",
    error: "DB error",
  });
});

});
