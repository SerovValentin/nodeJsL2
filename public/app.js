document.addEventListener("click", (event) => {
  if (event.target.dataset.type === "remove") {
    const id = event.target.dataset.id;
    remove(id).then(() => {
      event.target.closest("li").remove();
    });
  } else if (event.target.dataset.type === "edit") {
    const id = event.target.dataset.id;
    let newTitle = prompt("Введите новое название");
    if (newTitle && newTitle.trim() !== "") {
      edit(id, newTitle)
        .then(() => {
          const item = event.target.closest("li");
          if (item) {
            const titleElement = item.querySelector("span");
            if (titleElement) {
              titleElement.textContent = newTitle;
            }
          }
        })
        .catch((error) => {
          console.error("Ошибка:", error);
          alert("Не удалось обновить название. Попробуйте еще раз.");
        });
    }
  }
});

async function remove(id) {
  await fetch(`/${id}`, { method: "DELETE" });
}

async function edit(id, newTitle) {
  try {
    const response = await fetch(`/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle }),
    });

    if (!response.ok) {
      throw new Error("Ошибка при редактировании");
    }
  } catch (error) {
    console.error("Ошибка:", error);
    throw error;
  }
}
