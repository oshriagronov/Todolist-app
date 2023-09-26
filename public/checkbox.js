function checkboxChanged() {
    // Get the checkbox value
    const checkboxValue = document.querySelectorAll('input[name="checkbox"]');
    for(const element of checkboxValue){
      if(element.checked === true){
        const parentElement = element.parentNode;
        const pElement = parentElement.querySelector('p');
        pElement.classList.add("completed")
      }
      else{
        const parentElement = element.parentNode;
        const pElement = parentElement.querySelector('p');
        pElement.classList.remove("completed")
      }
    }
  }
  