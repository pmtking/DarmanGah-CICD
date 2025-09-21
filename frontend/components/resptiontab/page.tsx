import React from "react";
import "./style.scss";
interface respotionTab {
  id ?: number ;

}
const Resptiontab = ({id}:respotionTab) => {
  return (
    <>
      {id == 1 && (
        <>
          sdsd
        </>
      )}
      {id == 2 && (
        <>
          sdsd
        </>
      )}
    </>
  );
};

export default Resptiontab;
