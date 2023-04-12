import React, {useState} from 'react';
import {Select, MenuItem, SelectChangeEvent} from '@mui/material';

interface Option {
  value: string;
  label: string;
  colour: string;
}

interface Props {
  options: Option[];
  onChange: (event: SelectChangeEvent<string>) => void;
}

export default function SelectComponent({options, onChange}: Props) {
  const [selectedOption, setSelectedOption] = useState<Option | null>(
    options[0],
  );

  const handleOptionChange = (event: SelectChangeEvent<string>) => {
    const selectedValue = event.target.value as string;
    const selectedOption = options.find(
      option => option.value === selectedValue,
    );
    setSelectedOption(selectedOption || null);
    onChange(event);
  };

  return (
    <Select
      variant="standard"
      value={selectedOption?.value ?? ''}
      onChange={handleOptionChange}
      sx={{zIndex: 9998, backgroundColor: 'lightgray', p: 1}}>
      {options.map(option => (
        <MenuItem
          key={option.value}
          value={option.value}
          sx={{color: option.colour}}>
          {option.label}
        </MenuItem>
      ))}
    </Select>
  );
}
