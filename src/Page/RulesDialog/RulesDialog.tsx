import { Modal } from "../Modal";

export const RulesDialog = () => {
  return (
    <Modal title="Reglene" kind="rules">
      <h3>Målet</h3>
      <p>
        Målet er å finne sekvenser av ord som starter på den ene kanten og
        berører til slutt motsatt side.
      </p>
      <p>
        Hvis sekvensen begynner i ett hjørne, må den berøre det motsatte hjørne.
      </p>
      <p>Prøv å bruke så få ord som mulig!</p>
      <hr />
      <h3>Reglene</h3>
      <p>Gyldige ord er:</p>
      <ul>
        <li>minst 3 bokstaver</li>
        <li>kjent ord i ordlist</li>
        <li>tegnet med opp/ned/venstre/høyre</li>
      </ul>
    </Modal>
  );
};
