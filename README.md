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

Add the env variable to your project: `NEXT_PUBLIC_WORDPRESS_API_URL`. Add your domain to it. i.e.
`NEXT_PUBLIC_WORDPRESS_API_URL=https://www.YOURWPSITE.com/graphql`.

This variable is called internally by the `getGravityForm` function.

Import the component and use it with the API function. Select the required form using its `databaseId`.

```js
import GravityFormForm, { getGravityForm } from "next-gravity-forms";

const data = await getGravityForm(1);

return <GravityFormForm data={data} />;

### Redirecting

This package can be used with any React project. We just named it Next, because we use it with Next projects.

To allow it to be flexible, we have added a number of arguments to the main component.

```

const GravityFormForm = ({
data,
presetValues = () => {},
successCallback = () => {},
errorCallback = {},
navigate,
})

````

- date: The form data needed to create the form. Got via `getGravityForm` query.
- presetValues: Any preset values needed to pass in - see below.
- successCallback: Function that is called when form is successul.
- errorCallback: Function that is called when the form errors.
- navigate: Function that is called with URL for redirecting the user.


### Caching

If you are wanting to use a provider like Stellate to cache your form queries, pass the Stellate URL to `NEXT_PUBLIC_WORDPRESS_API_URL`.

You will then need to pass in a clean URL for the form to submit. This can be passed in with `NEXT_PUBLIC_WORDPRESS_FORM_SUBMIT_URL`.

Note: If `NEXT_PUBLIC_WORDPRESS_FORM_SUBMIT_URL` is not passed in, it will fall back to `NEXT_PUBLIC_WORDPRESS_API_URL`.

### Passing in Preset Values

Sometimes you will want to conditionally set default values, or pass in data to hidden fields. This could be values for a user ID, or a current page.

This is handled by the `presetValues` prop.

```js
<GravityFormForm data={form} presetValues={{ input_2: "My preset value" }} />
````

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
