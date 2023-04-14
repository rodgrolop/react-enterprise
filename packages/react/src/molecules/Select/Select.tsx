import React, {
  KeyboardEventHandler,
  useEffect,
  createRef,
  useRef,
  useState,
} from "react";
import Text from "../../atoms/Text";

const KEY_CODES = {
  ENTER: 13,
  SPACE: 32,
  DOWN_ARROW: 40,
  UP_ARROW: 38,
  ESC: 27,
};

interface SelectOption {
  label: string;
  value: string;
}

interface RenderOptionProps {
  isSelected: boolean;
  option: SelectOption;
  getOptionRecommendedProps: (overrideProps?: Object) => Object;
}

interface SelectProps {
  onOptionSelected?: (option: SelectOption, optionIndex: number) => void;
  options?: SelectOption[];
  label?: string;
  renderOption?: (props: RenderOptionProps) => React.ReactNode;
}

const getPreviousOptionIndex = (
  currentIndex: number | null,
  options: SelectOption[]
) => {
  if (currentIndex === null) {
    return 0;
  }
  if (currentIndex === 0) {
    return options.length - 1;
  }
  return currentIndex - 1;
};

const getNextOptionIndex = (
  currentIndex: number | null,
  options: SelectOption[]
) => {
  if (currentIndex === null) {
    return 0;
  }
  if (currentIndex === options.length - 1) {
    return 0;
  }
  return currentIndex + 1;
};

const Select: React.FC<SelectProps> = ({
  options = [],
  label = "Please select an option...",
  onOptionSelected: handler,
  renderOption,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [overlayTop, setOverlayTop] = useState<number>(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const labelRef = useRef<HTMLButtonElement>(null);
  const [optionRefs, setOptionRefs] = useState<
    React.RefObject<HTMLLIElement>[]
  >([]);

  const onOptionSelected = (option: SelectOption, optionIndex: number) => {
    if (handler) handler(option, optionIndex);
    setSelectedIndex(optionIndex);
    setIsOpen(!isOpen);
  };

  const onLabelClick = () => {
    setIsOpen(!isOpen);
  };

  const highlightOption = (optionIndex: number | null) => {
    setHighlightedIndex(optionIndex);
  };

  const onButtonKeyDown: KeyboardEventHandler = (event) => {
    event.preventDefault();
    if (
      [KEY_CODES.ENTER, KEY_CODES.SPACE, KEY_CODES.DOWN_ARROW].includes(
        event.keyCode
      )
    ) {
      setIsOpen(true);
      highlightOption(0);
    }
  };

  const onOptionKeyDown: KeyboardEventHandler = (event) => {
    if (event.keyCode === KEY_CODES.ESC) {
      setIsOpen(false);
      return;
    }
    if (event.keyCode === KEY_CODES.DOWN_ARROW) {
      highlightOption(getNextOptionIndex(highlightedIndex, options));
      return;
    }
    if (event.keyCode === KEY_CODES.UP_ARROW) {
      highlightOption(getPreviousOptionIndex(highlightedIndex, options));
      return;
    }
    if (event.keyCode === KEY_CODES.ENTER) {
      onOptionSelected(options[highlightedIndex!], highlightedIndex!);
      return;
    }
  };

  let selectedOption = null;
  if (selectedIndex !== null) selectedOption = options[selectedIndex];

  useEffect(() => {
    setOverlayTop((labelRef.current?.offsetHeight ?? 0) + 10);
  }, [labelRef.current?.offsetHeight]);

  useEffect(() => {
    setOptionRefs(options.map((_) => createRef<HTMLLIElement>()));
  }, [options.length]);

  useEffect(() => {
    if (highlightedIndex !== null && isOpen) {
      const ref = optionRefs[highlightedIndex];
      if (ref && ref.current) {
        ref.current.focus();
      }
    }
  }, [isOpen, highlightedIndex]);

  return (
    <div className="dse-select">
      <button
        aria-controls="dse-select-list"
        aria-haspopup={true}
        aria-expanded={isOpen ? true : undefined}
        ref={labelRef}
        className="dse-select__label"
        onKeyDown={onButtonKeyDown}
        onClick={() => onLabelClick()}
        data-testid="DseSelectButton"
      >
        <Text>{selectedOption === null ? label : selectedOption.label}</Text>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className={`dse-select__caret ${
            isOpen ? "dse-select__caret--open" : "dse-select__caret--closed"
          }`}
          width="1rem"
          height="1rem"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
          />
        </svg>
      </button>
      {
        <ul
          role="menu"
          id="dse-select-list"
          style={{ top: overlayTop }}
          className={`dse-select__overlay ${
            isOpen ? "dse-select__overlay--open" : ""
          }`}
        >
          {options.map((option, optionIndex) => {
            const isSelected = selectedIndex === optionIndex;
            const isHighlighted = highlightedIndex === optionIndex;
            const ref = optionRefs[optionIndex];
            const renderOptionProps = {
              option,
              isSelected,
              getOptionRecommendedProps: (overrideProps = {}) => {
                return {
                  ref: ref,
                  role: "menuitemradio",
                  "aria-label": option.label,
                  "aria-checked": isSelected ? true : false,
                  onKeyDown: onOptionKeyDown,
                  tabIndex: isHighlighted ? -1 : 0,
                  onMouseEnter: () => highlightOption(optionIndex),
                  onMouseLeave: () => highlightOption(null),
                  className: `dse-select__option ${
                    isSelected ? "dse-select__option--selected" : ""
                  } ${isHighlighted ? "dse-select__option--highlighted" : ""}`,
                  onClick: () => onOptionSelected(option, optionIndex),
                  key: option.value,
                  ...overrideProps,
                };
              },
            };

            if (renderOption) {
              return renderOption(renderOptionProps);
            }

            return (
              <li {...renderOptionProps.getOptionRecommendedProps()}>
                <Text>{option.label}</Text>
                {isSelected ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                    width="1rem"
                    height="1rem"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                ) : null}
              </li>
            );
          })}
        </ul>
      }
    </div>
  );
};

export default Select;
