import Joi from "joi";

const objectId =
    Joi.string()
        .hex()
        .length(24);

const imageSchema = Joi.object({
    url: Joi.string()
        .allow("")
        .default(""),

    public_id: Joi.string()
        .allow("")
        .default(""),
});

export const createAlternativeSchema =
    Joi.object({
        title: Joi.string()
            .trim()
            .required(),

        images: Joi.object({
            hero: imageSchema,
            faq: imageSchema,
        }).default({}).optional(),

        slug: Joi.string()
            .trim()
            .required(),

        pageDescription:
            Joi.string()
                .allow("")
                .default(""),

        seo: Joi.object({
            metaTitle:
                Joi.string()
                    .allow("")
                    .default(""),

            metaDescription:
                Joi.string()
                    .allow("")
                    .default(""),

            metaKeywords:
                Joi.array()
                    .items(
                        Joi.string()
                    )
                    .default([]),
        }),

        tools: Joi.array().items(
            Joi.object({
                toolId:
                    objectId.required(),

                customDescription:
                    Joi.string()
                        .allow("")
                        .default(""),

                position:
                    Joi.number()
                        .integer()
                        .min(0)
                        .default(0),
            })
        ),

        content: Joi.string()
            .allow("")
            .max(500000),

        faq: Joi.array()
            .items(
                Joi.object({
                    question: Joi.string()
                        .trim()
                        .required(),

                    answer: Joi.string()
                        .trim()
                        .required(),
                })
            )
            .default([]),

        status: Joi.string().valid(
            "active",
            "inactive"
        ),
    });



export const updateAlternativeSchema =
    Joi.object({

        title: Joi.string().trim(),

        images: Joi.object({
            hero: imageSchema,
            faq: imageSchema,
        }).default({}).optional(),

        toolId: objectId.optional(),

        slug: Joi.string().trim(),

        pageDescription:
            Joi.string().allow(""),

        seo: Joi.object({
            metaTitle:
                Joi.string().allow(""),

            metaDescription:
                Joi.string().allow(""),

            metaKeywords:
                Joi.array().items(
                    Joi.string()
                ),
        }),

        tools: Joi.array().items(
            Joi.object({
                toolId:
                    objectId.required(),

                customDescription:
                    Joi.string().allow(""),

                position:
                    Joi.number()
                        .integer()
                        .min(0),
            })
        ),

        status: Joi.string().valid(
            "active",
            "inactive"
        ),

        content: Joi.string()
            .allow("")
            .max(500000),

        faq: Joi.array().items(
            Joi.object({
                question: Joi.string()
                    .trim()
                    .required(),

                answer: Joi.string()
                    .trim()
                    .required(),
            })
        ),
    }).min(1);

export const alternativeIdSchema =
    Joi.object({
        id: objectId.required(),
    });