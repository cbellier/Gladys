/** 
  * Gladys Project
  * http://gladysproject.com
  * Software under licence Creative Commons 3.0 France 
  * http://creativecommons.org/licenses/by-nc-sa/3.0/fr/
  * You may not use this software for commercial purposes.
  * @author :: Pierre-Gilles Leymarie
  */
  
/**
* UserHouseRelationType.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

  	name :{
      type:'string',
      required:true
    },

    code:{
      type:'integer',
      required:true
    },

    userhouserelations:{
        collection: 'UserHouseRelation',
        via: 'userhouserelationtype'
    }

  }
};

