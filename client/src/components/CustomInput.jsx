import React from "react";
import styles from "../styles";

// NOTE We will test if player name only includes characters from this range
const regex = /^[A-Za-z0-9]+$/;

const CustomInput = ({ Label, value, placeholder, handleValueChange }) => {
  return (
    <>
      <label htmlFor="name" className={styles.label}>
        {Label}
      </label>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          if (e.target.value === "" || regex.test(e.target.value))
            handleValueChange(e.target.value);
        }}
        className={styles.input}
      />
    </>
  );
};

export default CustomInput;
