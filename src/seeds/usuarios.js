/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').del()
  await knex('users').insert([
    {username: 'javi',email:"upconectionupconection@gmail.com",name:"javier",apellidop:"cundapi",apellidom:"toledo",birthday:new Date('1966-10-31 08:13:20'),status:'VERIFIED',gender:"M"},
    {username: 'javi',email:"upconectionupconection@gmail.com",name:"javier",apellidop:"cundapi",apellidom:"toledo",birthday:new Date('1966-10-31 08:13:20'),status:'VERIFIED',gender:"M"},
    {username: 'javi',email:"upconectionupconection@gmail.com",name:"javier",apellidop:"cundapi",apellidom:"toledo",birthday:new Date('1966-10-31 08:13:20'),status:'VERIFIED',gender:"M"}
  ]);
};
