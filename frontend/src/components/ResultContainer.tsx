import './ResultContainer.scss';

const ResultContainer = ({
  imgFile,
  calResult,
  unit,
  description,
}: {
  imgFile: string;
  calResult: number;
  unit: string;
  description: string;
}) => {
  const numberString = calResult.toString();
  const decimalIndex = calResult.toString().indexOf('.');
  return (
    <div className="wrapper">
      <img className="wrapper_img" src={imgFile} />
      <div className="wrapper_res">
        <div className="wrapper_text">
          <div className="wrapper_text_res">
            {calResult
              ? decimalIndex !== -1 &&
                numberString.length - decimalIndex - 1 > 6
                ? calResult.toFixed(6)
                : numberString
              : 0}
            {unit}
          </div>
          <div className="wrapper_text_desc">{description}</div>
        </div>
      </div>
    </div>
  );
};

export default ResultContainer;
