# MicroAuth
The MicroAuth API documentation

## Version: 1.0


### /auth/register

#### POST
##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |

##### Responses

| Code | Description |
| ---- | ----------- |
| 201 | User created successfully |
| 400 | Bad request |

### /auth/login

#### POST
##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Login successful |
| 400 | Bad request |

### /auth/change-password

#### POST
##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| authorization | header | Authorization: Bearer token | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Password changed successfully |
| 400 | Bad request |

### /auth/request-password-reset

#### POST
##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Password reset email sent |
| 400 | Bad request |
| 404 | User not found |

### /auth/reset-password

#### POST
##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | Password changed successfully |
| 400 | Bad request |

### /auth/delete

#### DELETE
##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| authorization | header | Authorization: Bearer token | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | User deleted successfully |
| 400 | Bad request |

### Models


#### RegisterDto

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| email | string |  | Yes |
| password | string |  | Yes |

#### ChangePasswordDto

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| currentPassword | string |  | Yes |
| newPassword | string |  | Yes |

#### RequestResetDto

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| email | string |  | Yes |

#### ResetPasswordDto

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| resetToken | string |  | Yes |
| newPassword | string |  | Yes |

#### DeleteDto

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| email | string |  | Yes |