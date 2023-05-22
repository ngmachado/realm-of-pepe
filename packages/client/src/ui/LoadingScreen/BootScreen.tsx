import React from "react";
import styled from "styled-components";

type Props = {
  children: React.ReactNode;
};

export const BootScreen = ({ children }: Props) => {
  return (
    <Container>
      <div>
        <>{children || <>&nbsp;</>}</>
      </div>
    </Container>
  );
};

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  position: absolute;
  background-color: rgb(0 0 0 / 100%);
  display: grid;
  align-content: center;
  align-items: center;
  justify-content: center;
  justify-items: center;
  transition: all 2s ease;
  grid-gap: 50px;
  z-index: 100;
  pointer-events: none;
  color: white;
  top: 0;
  left: 0;

  div {
    font-family: "Lattice Pixel", sans-serif;
  }

  img {
    transition: all 2s ease;
    width: 100px;
  }
`;
