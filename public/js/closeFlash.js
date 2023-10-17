const alertList = document.querySelectorAll(".alert");
const alerts = [...alertList].map((element) => new bootstrap.Alert(element));
for (const alert of alerts) {
  setTimeout(() => {
    alert.close();
  }, 1500);
}
