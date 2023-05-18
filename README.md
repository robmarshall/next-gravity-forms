# Next JS Gravity Forms Component

A plug and play component for parsing GraphQL Gravity Form data. Outputs a component using BEM classes, meaning all you need to do is style it.

To be used alongside [wp-graphql-gravity-forms](https://github.com/harness-software/wp-graphql-gravity-forms) (version 0.12.0 up).

Uses [React Hook Forms](https://react-hook-form.com/) under the hood for all that good state management.

## Installation

```js
# Install the component
yarn add nextjs-gravity-forms

# Or with NPM
npm i nextjs-gravity-forms
```

## How To Use

Import the component and use it with a GraphQL query. Select the required form using its `databaseId`.

```js
import GravityFormForm, { getGravityForm } from "next-gravity-forms";

const data = await getGravityForm(1);

return <GravityFormForm data={data} />;
```

### Passing in Preset Values

Sometimes you will want to conditionally set default values, or pass in data to hidden fields. This could be values for a user ID, or a current page.

This is handled by the `presetValues` prop.

```js
<GravityFormForm data={form} presetValues={{ input_2: "My preset value" }} />
```

In the above example `input_2` corresponds to the 2nd field added in the WordPress Gravity Forms edit page. This value can be found by clicking on the field and looking at the top right just under Field Settings.

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

## Testing & Developing

Firstly, yes please! Any help would be great.

## To Do

### Field Components

- [x] Input
  - [ ] Email - Confirmation Email
- [x] Textarea
- [ ] Select (half done, need to add default values)
- [ ] Multiselect
- [x] Number
- [ ] Checkbox (half done, need to add default values)
- [ ] Radio (half done, need to add default values and correct error placement)
- [x] Hidden
- [x] HTML
- [x] Captcha
- [x] Add masking to inputs
- [ ] Section
- [ ] Page
- [ ] Date
- [ ] File upload
- [ ] Post Fields
- [ ] Pricing Fields
- [ ] Phone
- [ ] Email
- [ ] Configure error message (currently just 'An Unknown Error Occurred')
- [ ] Integrate Success/Failure Handler from previous plugin

### General Form

- [ ] Honeypot
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

- [x] Text Confirmation
- [ ] Page Change
- [ ] Redirect
- [ ] Redirect query strings
- [ ] Conditional Logic

## Known Issues

- [ ] Invalid phone number results in failed submission w/ non-descript general error message.
