class InputChecker{
  text(text){
      if(!text || text.length < 2)
          return false;
      return true;
  }
}

module.exports = new InputChecker();