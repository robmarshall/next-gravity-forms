import mockFormData from "../mocks/formData";

function getMockFieldByType(type) {
  const field = mockFormData.gfForm.formFields.nodes.find(
    (i) => i.type.toLowerCase() === type.toLowerCase()
  );

  return field;
}
export default getMockFieldByType;
