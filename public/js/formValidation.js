(() => {
  "use strict";

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll(".needs-validation");

  // Loop over them and prevent submission
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if (form.image && form.image.id === "imageUploadEdit") { //for the review form
          form.image.required = false;
        }
        if (form.image && form.image.files.length > 3) {
          form.image.value = "";
          form.image.required = true; //for the review form
        }
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false
    );
  });
})();
