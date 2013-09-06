fbash
=====

A Command Line Interface for Facebook

fbash is a plugin for Facebook that provides a CLI for facebook read/write operations. Built on top of Facebook's Javascript SDK, FQL and Open Graph API, fbash features some of the well-known CLI features like command lookup, help and command history.

Example usage:

exit : exit shell

cls : clear screen

help 'command_name' : show help for 'command_name'



find -n "friend_name" : find by name

find -l "location_name" : find by place

find -o : find all online friends

show -pof "friend_name" : show POsts From 'friend_name' (max limit set)

show -phb "friend_name" : show 'recent' PHotos uploaded By 'friend_name'

show -poa  : show recent posts from all friends on the user's wall


