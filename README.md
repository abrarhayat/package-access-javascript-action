# Check package access to Github Packages

## Inputs

### `organization`

**Required** The name of the organisation to look for packages. Defaults to env variable `GITHUB_REPOSITORY_OWNER`.

### `include-current-repo`

**Optional** Whether the current repo packages need to be includes to the check. Defaults to ```false```

### `personal-access-token`

**Optional** Enter the personal access token as input if using

### Building the distribution

The distribution must be built and commited before using.  

```javascript
ncc build index.js --license licenses.txt
```

## Example usage

```yaml
- name: Check for api token access
id: check-package-access
uses: actions/package-access-javascript-action@master
with:
  organisation: 'you-org-name'
  include-current-repo: 'true'
  personal-access-token: ${{ secrets.PERSONAL_ACCESS_TOKEN }}
```

## Testing Locally

If you're testing the script locally, make sure to create an ```.env``` file with a valid github personal access token, current repo name (where the action is running) in the owner/repo format  and a test input organisation name

```sh
GITHUB_TOKEN=xxxxxxxxx
GITHUB_REPOSITORY=xxxxx
GITHUB_REPOSITORY_OWNER=xxxxx
```

## Run script

```js
node --env-file=.env package-access.js
```
