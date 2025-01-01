import { Modal } from "../Modal";

export const RulesDialog = () => {
  return (
    <Modal title="Reglene" kind="rules">
      <h3>Mål</h3>
      <p>
        Målet er å finne sekvenser av ord som starter på den ene kanten og
        berører til slutt motsatt side.
      </p>
      <p>
        Hvis sekvensen begynner i ett hjørne, må den berøre det motsatte hjørne.
      </p>
      <p>Prøv å bruke så få ord som mulig!</p>
    </Modal>
  );
};
