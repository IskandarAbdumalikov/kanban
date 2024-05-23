import { useRef, useState, useEffect } from "react";
import { DATA } from "@/static";

const KanbanBoard = () => {
  const [data, setData] = useState(() => {
    const savedData = localStorage.getItem("kanbanData");
    return savedData ? JSON.parse(savedData) : DATA;
  });

  const [status, setStatus] = useState(null);
  const [commits, setCommits] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentItemId, setCurrentItemId] = useState(null);
  const title = useRef();
  const desc = useRef();
  const form = useRef();

  useEffect(() => {
    localStorage.setItem("kanbanData", JSON.stringify(data));
  }, [data]);

  const handleDeleteItem = (id) => {
    if (confirm("Are you sure")) {
      setData((prevData) => prevData.filter((item) => item.id !== id));
    }
  };

  const handleCreateOrEditItem = (e) => {
    e.preventDefault();
    const id = isEditing ? currentItemId : new Date().getTime();
    const newItem = {
      id,
      title: title.current.value,
      desc: desc.current.value,
      status,
    };

    if (isEditing) {
      setData((prevData) =>
        prevData.map((item) => (item.id === id ? newItem : item))
      );
    } else {
      setData((prevData) => [...prevData, newItem]);
    }

    resetForm();
  };

  const handleEditItem = (item) => {
    setIsEditing(true);
    setCurrentItemId(item.id);
    setStatus(item.status);
    title.current.value = item.title;
    desc.current.value = item.desc;
  };

  const handleStatusChange = (id, newStatus) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.id === id ? { ...item, status: newStatus } : item
      )
    );
  };

  const resetForm = () => {
    setIsEditing(false);
    setCurrentItemId(null);
    setStatus(null);
    title.current.value = "";
    desc.current.value = "";
  };

  const filterByStatus = (status) => {
    return data
      ?.filter((el) => el.status === status)
      .map((el) => (
        <div key={el.id} className="kanban__item">
          <div className="kanban__status">
            <p>{el.title}</p>
            <button
              className="delete__btn"
              onClick={() => handleDeleteItem(el.id)}
            >
              delete
            </button>
            <button className="edit__btn" onClick={() => handleEditItem(el)}>
              edit
            </button>
          </div>
          <div className="commit">
            <p
              className={
                commits ? "kanban__commit show__commits" : "kanban__commit"
              }
            >
              {el.desc}
            </p>
            <button onClick={() => setCommits((prev) => !prev)}>
              {commits ? "Hide commits" : "See commits"}
            </button>
          </div>
          <div className="kanban__status">
            <select
              value={el.status}
              onChange={(e) => handleStatusChange(el.id, e.target.value)}
              name=""
              id=""
            >
              <option value="ready">Ready</option>
              <option value="working">Working</option>
              <option value="stuck">Stuck</option>
              <option value="done">Done</option>
            </select>
            <span>9:04</span>
          </div>
        </div>
      ));
  };

  const kanbanReadyItems = filterByStatus("ready");
  const kanbanWorkingItems = filterByStatus("working");
  const kanbanStuckItems = filterByStatus("stuck");
  const kanbanDoneItems = filterByStatus("done");

  return (
    <section>
      <div className="container">
        <div className="kanban">
          <h2 className="kanban__title">Kanban Board</h2>
          <form
            ref={form}
            onSubmit={handleCreateOrEditItem}
            action=""
            className={`kanban__module ${status ? "show" : ""}`}
          >
            <input
              placeholder="Enter a title"
              autoFocus={true}
              ref={title}
              type="text"
            />
            <input placeholder="Enter a description" ref={desc} type="text" />
            <button>{isEditing ? "Update" : "Add"}</button>
            <button
              type="button"
              style={{ background: "red" }}
              onClick={resetForm}
            >
              Cancel
            </button>
          </form>
          <div className="kanban__wrapper">
            <div className="kanban__box ready">
              <div className="kanban__heading">
                <p>Ready to start / {kanbanReadyItems?.length}</p>
              </div>
              <div className="kanban__block">
                {kanbanReadyItems?.length > 0 ? (
                  kanbanReadyItems
                ) : (
                  <p className="kanban__nothing">Nothing founded</p>
                )}
              </div>
              <button
                onClick={() => setStatus("ready")}
                className="kanban__add_btn"
              >
                Add item
              </button>
            </div>
            <div className="kanban__box working">
              <div className="kanban__heading">
                <p>Working to start / {kanbanWorkingItems.length}</p>
              </div>
              <div className="kanban__block ">
                {kanbanWorkingItems?.length > 0 ? (
                  kanbanWorkingItems
                ) : (
                  <p>Nothing founded</p>
                )}
              </div>
              <button
                onClick={() => setStatus("working")}
                className="kanban__add_btn"
              >
                Add item
              </button>
            </div>
            <div className="kanban__box stuck">
              <div className="kanban__heading">
                <p>Stuck to start / {kanbanStuckItems.length}</p>
              </div>
              <div className="kanban__block">
                {kanbanStuckItems?.length > 0 ? (
                  kanbanStuckItems
                ) : (
                  <p>Nothing founded</p>
                )}
              </div>
              <button
                onClick={() => setStatus("stuck")}
                className="kanban__add_btn"
              >
                Add item
              </button>
            </div>
            <div className="kanban__box done">
              <div className="kanban__heading">
                <p>Done to start / {kanbanDoneItems.length}</p>
              </div>
              <div className="kanban__block">
                {kanbanDoneItems?.length > 0 ? (
                  kanbanDoneItems
                ) : (
                  <p>Nothing founded</p>
                )}
              </div>
              <button
                onClick={() => setStatus("done")}
                className="kanban__add_btn"
              >
                Add item
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default KanbanBoard;
