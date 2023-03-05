const Joi = require('joi');


//validation schema for module
let validation_schema_module  = Joi.object({
    module : Joi.string().required(),
    //allwoing 0 to be part of note because positve is > 0
    note : Joi.number().positive().allow(0)
})

//validation schema with joi
let validation_schema_etudiant = Joi.object({
    nom : Joi.string().min(5).max(50).required(),

    classe : Joi.string().required(),

    modules : Joi.array().items(validation_schema_module).required(),
    
    moyenne : Joi.number().positive().allow(0)
});

//validation schema with joi
let validation_schema_update_etudiant = Joi.object({
    nom : Joi.string().min(5).max(50),

    classe : Joi.string(),

    modules : Joi.array().items(validation_schema_module),
    
    moyenne : Joi.number().positive().allow(0)
});


module.exports.validation_schema_etudiant = validation_schema_etudiant;

module.exports.validation_schema_update_etudiant = validation_schema_update_etudiant ;
module.exports.validation_schema_module = validation_schema_module;