import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Select } from 'antd';
import { ErrorMessage, useField, useFormikContext } from 'formik';
import { GetClassName } from '../helpers/common-function';
import { useIntl } from 'react-intl';
import { DisplayError } from "./field-feedback-label";
import _ from "lodash";

const { Option } = Select;

function TagInput({
  label,
  data,
  value,
  name,
  mode,
  labelWidth,
  required,
  disabled,
  tagData,
  root,
  withFeedbackLabel = true,
  placeholder,
  fieldName,
  secondaryField,
  secondaryId,
  ...props
}: {
  placeholder?: string;
  [X: string]: any;
}) {
  const validate = useCallback((value: any): string | void => {
    if (required && !value) return 'TAG.ERROR.REQUIRED';
  }, [required, value]);
  const [field] = useField({ name, validate });
  const [optionData, setOptionData] = useState(tagData);
  const { setFieldValue, errors, touched, getFieldMeta, values, handleChange, setFieldTouched } = useFormikContext<any>();

  useMemo(() => {
    setOptionData([...tagData, ...field.value ?? []]);
    console.log([...tagData, ...field.value ?? []])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tagData])

  const intl = useIntl();
  const _label = useMemo(() => (_.isString(label) ? intl.formatMessage({ id: label }) : label), []);
  console.log({ required })
  return (
    <>
      <div className={mode === 'horizontal' ? 'row' : ''}>
        <div className={mode === 'horizontal' ? GetClassName(labelWidth, true) : ''}>
          {_label && (
            <label className={mode === 'horizontal' ? 'mb-0 mt-2' : ''}>
              {_label}{required && <span className="text-danger">*</span>}
            </label>
          )}
        </div>
        <div className={mode === 'horizontal' ? GetClassName(labelWidth, false) : ''}>
          <Select
            mode="multiple"
            style={{ width: '100%' }}
            value={field.name === "serviceInfo" ? field.value?.map((e: any) => e.serviceId ?? e) : field.value}
            placeholder={intl.formatMessage({ id: placeholder }, { label: _.isString(_label) ? _label : '' })}
            onChange={(value: any) => {
              setFieldTouched(name, true);
              setFieldValue(name, value);
            }}
            onBlur={(e) => {
              setFieldTouched(name, true);
            }}
            {...props}
            optionFilterProp="children"
            disabled={disabled ? typeof disabled === 'boolean' ? disabled : disabled(values) : disabled}
            className={`${getFieldMeta(field.name).touched && getFieldMeta(field.name).error ? 'border border-danger rounded' : ''}`}
          >
            {optionData && optionData.map((item: any, key: any) => (
              <Option key={item.id ?? item[secondaryId]} value={item.id ?? item[secondaryId]}>
                {fieldName ? item[fieldName] ?? item[secondaryField] : item.id ?? item[secondaryId]}
              </Option>
            ))}
          </Select>
          {withFeedbackLabel && (<ErrorMessage name={field.name}>
            {msg => <DisplayError label={_label} error={msg} />
            }
          </ErrorMessage>)}
        </div>
      </div>
    </>
  );
}

export default TagInput;
