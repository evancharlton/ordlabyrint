import { Modal } from "../Modal";

export const RulesDialog = () => {
  return (
    <Modal title="Reglene" kind="rules">
      <h3>Mål</h3>
      <p>
        The goal is to find sequences of words which start on one edge and
        eventually touch the opposite side.
      </p>
      <p>
        If the sequence begins in one corner, then it must touch the opposite
        corner.
      </p>
      <p>Try to use as few words as possible!</p>
    </Modal>
  );
};
