## Translation

Apexo is already being provided with multiple translations:

-   Arabic
-   German
-   Simplified Chinese
-   Spanish

If you want to add your own language or fix any of the translations above make sure to checkout the [files in the repository](https://github.com/alexcorvi/apexo/tree/master/src/core/internationalization/languages) and submit a _pull request_ or try to contact me at [ali.a.saleem@outlook.com](mailto:ali.a.saleem@outlook.com) if you don't know how to submit a _pull request_.

## How to write a translation

You need to use the file [raw.ts](https://github.com/alexcorvi/apexo/blob/master/src/core/internationalization/languages/raw.ts) and simply, for each sentence or word in the file add the translation between the empty double quotes at the same line.

#### Example

```
{
    "hello": "hola",
    "bye": "adios",
    "good morning": "buenos días",
    "book an appointment": "reservar una cita,
}
```

any non translated word or sentence will be displayed in the default language (English)
