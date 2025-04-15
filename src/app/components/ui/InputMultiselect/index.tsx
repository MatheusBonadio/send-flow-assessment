import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  ListItemText,
  SelectChangeEvent,
} from '@mui/material';

interface SelectOption {
  value: string | number;
  label: string;
}

interface IProps {
  options: SelectOption[];
  value: (string | number)[];
  onChange: (event: SelectChangeEvent<(string | number)[]>) => void;
  label?: string;
}

export default function CustomMultiSelect({
  options,
  value,
  onChange,
  label,
}: IProps) {
  return (
    <FormControl fullWidth>
      {label && <InputLabel>{label}</InputLabel>}
      <Select
        multiple
        value={value}
        onChange={onChange}
        renderValue={(selected) => (
          <div className="flex flex-wrap gap-2">
            {selected.map((val) => (
              <div
                key={val}
                className="bg-primary-light rounded-default px-2 py-1 text-white"
              >
                {options.find((option) => option.value === val)?.label}
              </div>
            ))}
          </div>
        )}
        displayEmpty
        label={label}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            <Checkbox checked={value.includes(option.value)} />
            <ListItemText primary={option.label} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
