export const handleResponse = (res) => {
  let messageError = false;
  switch (res.status) {
    case 200:
      console.log('success')
      break;
    case 400:
      console.log('logic error');
      messageError = "Valores invalidos."
      break;
    case 500:
      messageError = "Error interno en el sistema."
      console.log('server error, try again')
      break
    default:
      messageError = "Intente más tarde."
      console.log('unhandled')
      break
  }
  if(messageError)
    throw messageError;

  return res.json()

}