import { Fragment } from "react";
import type { Locale } from "@/lib/seo";
import { A, P } from "./prose";
import { REPOSITORY_URL, repositoryFolderUrl } from "../repository";

const REPOSITORY_LABEL = "hilmarvdveen/zappy-mart";
const FOLDER_LABEL_PREFIX = "zappy-mart/";
const REPOSITORY_PLACEMENT = "post-repository";
const FOLDER_SEPARATOR = ", ";

const COPY = {
  sentence: {
    en: "The code behind this article runs in a public repository: ",
    nl: "De code achter dit artikel draait in een openbare repository: ",
  },
  wholeRepository: {
    en: ", all seven projects.",
    nl: ", alle zeven projecten.",
  },
  lastSeparator: { en: " and ", nl: " en " },
};

type PostRepositoryProps = {
  locale: Locale;
  folders?: string[];
};

export function PostRepository({ locale, folders = [] }: PostRepositoryProps) {
  if (folders.length === 0) {
    return (
      <P>
        {COPY.sentence[locale]}
        <A href={REPOSITORY_URL} placement={REPOSITORY_PLACEMENT}>
          {REPOSITORY_LABEL}
        </A>
        {COPY.wholeRepository[locale]}
      </P>
    );
  }

  const lastIndex = folders.length - 1;
  return (
    <P>
      {COPY.sentence[locale]}
      {folders.map((folder, index) => (
        <Fragment key={folder}>
          {index > 0 &&
            (index === lastIndex ? COPY.lastSeparator[locale] : FOLDER_SEPARATOR)}
          <A href={repositoryFolderUrl(folder)} placement={REPOSITORY_PLACEMENT}>
            {`${FOLDER_LABEL_PREFIX}${folder}`}
          </A>
        </Fragment>
      ))}
      {"."}
    </P>
  );
}
