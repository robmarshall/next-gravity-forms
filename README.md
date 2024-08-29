# Next JS Gravity Forms Component

A plug and play component for parsing GraphQL Gravity Form data. Outputs a component using BEM classes, meaning all you need to do is style it.

To be used alongside [wp-graphql-gravity-forms](https://github.com/harness-software/wp-graphql-gravity-forms) (version 0.12.0 up).

Uses [React Hook Forms](https://react-hook-form.com/) under the hood for all that good state management.

## Installation

either:

### Install with yarn

```shell
yarn add next-gravity-forms
```

or

### Install with NPM

```shell
npm i next-gravity-forms
```

## How To Use

Add the env variable to your project: `NEXT_PUBLIC_WORDPRESS_API_URL`. Add your domain to it. i.e.
`NEXT_PUBLIC_WORDPRESS_API_URL=https://www.YOURWPSITE.com/graphql`.

This variable is called internally by the `getGravityForm` function.

Import the component and use it with the API function. Select the required form using its `databaseId`.

```js
import GravityFormForm, { getGravityForm } from "next-gravity-forms";

const data = await getGravityForm(1);

return <GravityFormForm data={data} />;
```

### Redirecting

This package can be used with any React project. We just named it Next, because we use it with Next projects.

To allow it to be flexible, we have added a number of arguments to the main component.

```js
const GravityFormForm = ({
  data,
  presetValues = () => {},
  successCallback = () => {},
  errorCallback = {},
  navigate,
  helperText = {}
  customFormFields = {}
})

```

- data: The form data needed to create the form. Got via `getGravityForm` query.
- presetValues: Any preset values needed to pass in - see below.
- successCallback: Function that is called when form is successul.
- errorCallback: Function that is called when the form errors.
- navigate: Function that is called with URL for redirecting the user.
- helperText: Object with values to override strings - see the [Translation](#translation) section.
- customFormFields: Object that allows you to override form fields. See the [Custom Form Fields](#custom-form-fields) section.

### Caching

If you are wanting to use a provider like Stellate to cache your form queries, pass the Stellate URL to `NEXT_PUBLIC_WORDPRESS_API_URL`.

You will then need to pass in a clean URL for the form to submit. This can be passed in with `NEXT_PUBLIC_WORDPRESS_FORM_SUBMIT_URL`.

Note: If `NEXT_PUBLIC_WORDPRESS_FORM_SUBMIT_URL` is not passed in, it will fall back to `NEXT_PUBLIC_WORDPRESS_API_URL`.

### Passing in Preset Values

Sometimes you will want to conditionally set default values, or pass in data to hidden fields. This could be values for a user ID, or a current page.

This is handled by the `presetValues` prop.
In addition, you need to pass your query parameters within this prop to make [dynamically populating](https://docs.gravityforms.com/using-dynamic-population/#h-query-string) field work. Good to know that the query string takes priority over the field name parameter.

```js
<GravityFormForm
  data={form}
  presetValues={{ ...queryParams, input_2: "My preset value" }}
/>
```

In the above example `input_2` corresponds to the 2nd field added in the WordPress Gravity Forms edit page. This value can be found by clicking on the field and looking at the top right just under Field Settings.

### Translation

Since package uses some hardcoded strings, we implemented the way how to translate them to your preferable text.
`helperText` prop should be used to override it. You can find all possible strings [here](https://github.com/robmarshall/next-gravity-forms/blob/main/src/utils/strings.js). You can handle your own translations by passing in different strings depending on what is needed, and they will be merged with the existing ones. Alternatively, you can pass an entire object with translations for all strings. See the example below:

```js
<GravityFormForm
  data={form}
  helperText={{
    errors: {
      general: "There was a problem with your submission. Check errors",
      leastOneField: "At least one field must be filled out.",
      required: "Field is required.",
      pattern: {
        email: "The email address is invalid",
        phone: "This is an invalid phone",
      },
    },
    radio: {
      otherChoice: "Other", // alternatively you can override only specific field, .i.e. otherChoice_3
    },
  }}
/>
```

## WordPress Backend Not Allowing Submission

Having CORS issues?

Add the following snippet of code to your WordPress functions.php file.

Make sure to update the 'https://yourfrontendurl.com' to your actual frontend. With no trailing slash.

```
add_filter( 'graphql_response_headers_to_send', function( $headers ) {
	return array_merge( $headers, [
		'Access-Control-Allow-Origin'  => 'https://yourfrontendurl.com',
		'Access-Control-Allow-Methods' => 'POST, GET, OPTIONS, PUT, DELETE',
		'Access-Control-Allow-Credentials' => 'true'
	] );
} );
```

## Implementing Google reCAPTCHA

On your WordPress backend within the Gravity Forms settings set up reCaptcha. Follow the instructions provided by Gravity Forms.

## File Upload

To enable file uploading functionality, your GraphQL server must support the `Upload` scalar type. In WordPress, this can be easily achieved by installing the [WP GraphQL Upload](https://github.com/dre1080/wp-graphql-upload) plugin.

If you attempt to add a file upload field to your form without support for the `Upload` scalar type, your API will return an error. Ensure that your GraphQL server is properly configured to handle file uploads by integrating the WP GraphQL Upload plugin or another equivalent solution that provides support for the `Upload` type.

When enabling the `Enable Multi-File Upload` option, it's important to note that files are not uploaded immediately upon being dropped into the upload area. Instead, all files are uploaded together during the form submission process. However, be aware that this can introduce a delay, particularly when users upload large files. Might be good to show spinner while uploading.

## Date field

The `Date Picker` functionality in our form utilizes the `react-datepicker` package. Please note that this package does not include default styles. To ensure proper styling of the date picker, you must either provide your own custom styles or import the default styles from the package. To use the default styles, include the following import statement in your code:

```javascript
import "react-datepicker/dist/react-datepicker.css";
```

Additionally, our component allows you to customize the settings of the DatePicker through the `helperFieldsSettings` prop. This is particularly useful for setting constraints like the maximum year. For instance, to set the maximum year to `2024`, you would configure the prop as follows:

```
<GravityFormForm
  data={form}
  helperFieldsSettings={{
    date: {
     dateMaxYear: 2024
    },
  }}
/>
```

For a complete list of customizable options for the DatePicker, refer to the fieldsSettings.js file available in our repository: [fieldsSettings.js](https://github.com/robmarshall/next-gravity-forms/blob/main/src/utils/fieldsSettings.js).

## Number field

As you probably know, the Number field has an option to set the currency format. By default, we support only EUR, USD, and GBP currencies. If you would like to add a custom currency, other than set it by `gform_currency` filter, you also need to pass it as a prop using the `helperFieldsSettings` prop, as follows:

```
<GravityFormForm
  data={form}
  helperFieldsSettings={{
    number: {
     currencies: {
      HKD: {
        symbol_left: "HK$",
        symbol_right: "",
        symbol_padding: "",
        thousand_separator: ",",
        decimal_separator: ".",
        decimals: 2,
      }
     }
    },
  }}
/>
```

## Exposed methods

We expose several `react-hook-form` methods for flexible form management.

- `setError(name, error)` - Set an error for a field.
- `reset()` - Reset the form.
- `getValues(name)` - Get the value of a field or all values.
- `setValue(name, value)` - Set the value of a field.
- `watch(name)` - Watch for changes to a field.

```jsx
const GravityForm = ({ data }) => {
  const formRef = useRef();

  const handleReset = () => formRef.current.reset();
  const handleSetValue = () =>
    formRef.current.setValue("exampleField", "new value");

  return (
    <div>
      <GravityFormForm ref={formRef} data={data} />
      <button onClick={handleReset}>Reset Form</button>
      <button onClick={handleSetValue}>Set Field Value</button>
    </div>
  );
};

export default GravityForm;
```

## Custom Form Fields

Sometimes you may need to render custom markup for specific fields. You can achieve this by using the `customFormFields` property. See the example below:

```jsx
<GravityFormForm data={form} customFormFields={{ 1: CustomInputComponent }} />
```

By specifying the field ID that you want to override, you can pass your custom component. Note that your custom component must utilize the methods provided by react-hook-form, as it is registered using the [Controller](https://react-hook-form.com/docs/usecontroller/controller) component.

Example of your custom component:

```jsx
const CustomInputComponent = ({ value, onChange, onBlur, ...rest }) => {
  return (
    <div className="example">
      <input
        type="text"
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        {...rest}
      />
    </div>
  );
};
```

Take into account that your field must return the value in the same format as a default field.

## Testing & Developing

Firstly, yes please! Any help would be great.

### How to get started

There are a few steps to get a dev enviroment set up.

- Clone repo
- Clone https://github.com/robmarshall/next-gravity-forms-example to a different location
- Remove the next-gravity-forms package from the above example repo package.json
- Install packages on example repo
- Navigate into your local "next-gravity-forms" root.
- Install packages
- Build it using "yarn build"
- Navigate into the /dist folder and run yarn link
- Navigate back to the example repo root and run yarn link "next-gravity-forms"

You should now be able to run the example repo and see the dev form package running.

Currently whenever you make a change you will need to re-run `yarn build`. A hot-reload is yet to be added.

## To Do

### Field Components

- [x] Input
- [x] Textarea
- [x] Select
- [x] Multiselect
- [x] Number
- [x] Checkbox
- [x] Radio
- [x] Hidden
- [x] HTML
- [x] Captcha
- [x] Add masking to inputs
- [x] Section
- [ ] Page (half done, need to save values so that when the user refreshes the page, they are preserved)
- [x] Date
- [x] File upload
- [ ] Post Fields
- [ ] Pricing Fields
- [x] Phone (doesn't support custom phone type)
- [x] Email
- [ ] Configure error message (currently just 'An Unknown Error Occurred')
- [ ] Integrate Success/Failure Handler from previous plugin

### General Form

- [x] Honeypot
- [ ] Save and Continue
- [x] Add submit/error callback for custom use

### Add Tests to Inputs

- [ ] Input
- [ ] Textarea
- [ ] Select (half done, need to add default values)
- [ ] Multiselect
- [ ] Number
- [ ] Checkbox (half done, need to add default values)
- [ ] Radio (half done, need to add default values)
- [ ] Hidden
- [ ] HTML
- [ ] Captcha

## Confirmations

- [x] Text Confirmation (`{all_fields}` is not supported)
- [ ] Page Change
- [x] Redirect
- [x] Redirect query strings support only form fields (excluding file uploads) and do not support user/entry-related fields (e.g., User IP, entry ID)
- [x] Conditional Logic

## Known Issues

- [ ] Invalid phone number results in failed submission w/ non-descript general error message.

```

```
