import classnames from "classnames";
import PropTypes from "prop-types";
import { useFormContext } from "react-hook-form";
import InputWrapper from "../InputWrapper";

const Section = ({ fieldData, name, wrapClassName, wrapId }) => {
  const { cssClass } = fieldData;

  const {
    formState: { errors },
  } = useFormContext();

  return (
    <InputWrapper
      errors={errors?.[name] || {}}
      inputData={fieldData}
      wrapClassName={wrapClassName}
      wrapId={wrapId}
    >
      <div
        className={classnames("gravityform__field__section", cssClass)}
        style={{ borderBottom: "1px solid #ccc", marginBlock: "10px" }}
      />
    </InputWrapper>
  );
};

export default Section;

Section.propTypes = {
  fieldData: PropTypes.shape({
    cssClass: PropTypes.string,
  }),
  name: PropTypes.string,
  wrapClassName: PropTypes.string,
  wrapId: PropTypes.string,
};
