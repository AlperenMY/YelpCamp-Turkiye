const alertList = document.querySelectorAll(".alert-dismissible");
const alerts = [...alertList].map((element) => new bootstrap.Alert(element));
for (const alert of alerts) {
  setTimeout(() => {
    alert.close();
  }, 3000);
}
addEventListener("scroll", () => {
  alerts.forEach((alert) => alert.close());
});
