@AllowedUserRoles(['USER'])
@ApiPaginatedListResponse(UserResponseDto, ['id', 'name', 'email'])