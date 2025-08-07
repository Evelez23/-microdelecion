/* Estilos para las secciones de género */
.gender-section {
  margin-bottom: 30px;
}

.gender-section h2 {
  color: #2c3e50;
  border-bottom: 2px solid #3498db;
  padding-bottom: 5px;
}

/* Botones de pacientes */
.patient-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 15px;
  margin-top: 20px;
}

.patient-button {
  background: #e8f4fc;
  border: none;
  border-radius: 10px;
  padding: 15px;
  cursor: pointer;
  text-align: left;
  transition: transform 0.2s, box-shadow 0.2s;
}

.patient-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.patient-name {
  font-weight: bold;
  display: block;
  color: #2980b9;
}

.patient-age {
  font-size: 0.9em;
  color: #7f8c8d;
}

/* Modal */
.patient-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 25px;
  border-radius: 10px;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
}

.close-modal {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 5px;
  margin-top: 15px;
  cursor: pointer;
}
