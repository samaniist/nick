import type { Metadata } from "next";

import {
  LegalPage,
  LegalSection,
  legalLinkClass,
} from "@/components/legal/legal-page";

export const metadata: Metadata = {
  title: "Datenschutzerklärung",
  description:
    "Datenschutzerklärung von Nexlytic mit Informationen zu Hosting, Server-Logs und Kontaktaufnahme.",
  alternates: { canonical: "/datenschutz" },
  openGraph: {
    title: "Datenschutzerklärung | Nexlytic",
    description: "Informationen zur Verarbeitung personenbezogener Daten bei Nexlytic.",
    url: "https://nexlytic.de/datenschutz",
    locale: "de_DE",
  },
};

const navItems = [
  { href: "#verantwortlicher", label: "Verantwortlicher" },
  { href: "#hosting", label: "Hosting & Server-Logs" },
  { href: "#kontakt", label: "Kontaktaufnahme" },
  { href: "#cookies", label: "Cookies & Tracking" },
  { href: "#schriftarten", label: "Schriftarten" },
  { href: "#externe-links", label: "Externe Links" },
  { href: "#empfaenger", label: "Empfänger & Drittland" },
  { href: "#speicherdauer", label: "Speicherdauer" },
  { href: "#rechte", label: "Ihre Rechte" },
  { href: "#aufsicht", label: "Aufsichtsbehörde" },
  { href: "#sicherheit", label: "Sicherheit & Aktualisierung" },
];

export default function DatenschutzPage() {
  return (
    <LegalPage
      eyebrow="Rechtliche Angaben / 02"
      title="Datenschutz"
      intro="Transparent erklärt: welche personenbezogenen Daten beim Besuch dieser Website und bei einer Kontaktaufnahme verarbeitet werden."
      updated="22. September 2026"
      navItems={navItems}
      siblingHref="/impressum"
      siblingLabel="Impressum"
    >
      <LegalSection id="verantwortlicher" index="01" title="Verantwortlicher">
        <p>Verantwortlicher im Sinne der Datenschutz-Grundverordnung (DSGVO) ist:</p>
        <address className="not-italic">
          <strong className="font-semibold text-black">Nexlytic</strong>
          <br />
          Einzelunternehmen
          <br />
          Inhaber: Ali Pouryaghma
          <br />
          München, Deutschland
        </address>
        <p>
          Telefon:{" "}
          <a className={legalLinkClass} href="tel:+4917670767725">
            +49 176 70767725
          </a>
          <br />
          E-Mail:{" "}
          <a className={legalLinkClass} href="mailto:hello@nexlytic.de">
            hello@nexlytic.de
          </a>
        </p>
      </LegalSection>

      <LegalSection id="hosting" index="02" title="Hosting und Server-Logfiles">
        <p>
          Diese Website wird über die Infrastruktur von{" "}
          <strong className="font-semibold text-black">Vercel Inc.</strong>, 440 N Barranca
          Ave #4133, Covina, CA 91723, USA, bereitgestellt.
        </p>
        <p>
          Beim Aufruf der Website werden technisch notwendige Verbindungsdaten verarbeitet.
          Dazu können insbesondere IP-Adresse, Datum und Uhrzeit des Zugriffs, aufgerufene
          URL, Referrer-URL, Browser- und Betriebssysteminformationen, HTTP-Statuscode und
          übertragene Datenmenge gehören.
        </p>
        <p>
          Die Verarbeitung erfolgt, um die Website sicher und stabil auszuliefern,
          Missbrauch abzuwehren und technische Fehler zu analysieren. Rechtsgrundlage ist
          Art. 6 Abs. 1 lit. f DSGVO. Unser berechtigtes Interesse liegt im sicheren,
          zuverlässigen und wirtschaftlichen Betrieb dieser Website.
        </p>
        <p>
          Vercel kann Daten auch in den USA verarbeiten. Weitere Informationen zu
          Verarbeitung, Unterauftragnehmern und Garantien für internationale Übermittlungen
          finden Sie in der{" "}
          <a
            className={legalLinkClass}
            href="https://vercel.com/legal/privacy-notice"
            target="_blank"
            rel="noopener noreferrer"
          >
            Datenschutzerklärung von Vercel
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection id="kontakt" index="03" title="Kontaktaufnahme und Kontaktformular">
        <p>
          Wenn Sie uns per Kontaktformular, E-Mail oder Telefon kontaktieren, verarbeiten
          wir Ihre Angaben zur Bearbeitung und Beantwortung Ihrer Anfrage. Beim Formular
          sind Name und E-Mail-Adresse erforderlich; Thema, Telefonnummer und Nachricht
          können freiwillig angegeben werden.
        </p>
        <p>
          Erfolgt die Kontaktaufnahme zur Anbahnung oder Durchführung eines Vertrags, ist
          Art. 6 Abs. 1 lit. b DSGVO die Rechtsgrundlage. Bei allgemeinen Anfragen beruht die
          Verarbeitung auf Art. 6 Abs. 1 lit. f DSGVO. Unser berechtigtes Interesse ist die
          sachgerechte Bearbeitung geschäftlicher Kommunikation.
        </p>
        <p>
          Das Kontaktformular speichert Ihre Nachricht nicht in einer eigenen
          Website-Datenbank. Die Angaben werden über unsere Server-Schnittstelle an unser
          E-Mail-Postfach übermittelt. Für die E-Mail-Infrastruktur setzen wir{" "}
          <strong className="font-semibold text-black">IONOS SE</strong>, Elgendorfer Str.
          57, 56410 Montabaur, ein. Weitere Informationen finden Sie in der{" "}
          <a
            className={legalLinkClass}
            href="https://www.ionos.de/terms-gtc/datenschutzerklaerung/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Datenschutzerklärung von IONOS
          </a>
          .
        </p>
        <p>
          Ohne die als erforderlich gekennzeichneten Angaben können wir Ihre Anfrage über
          das Formular nicht beantworten. Eine gesetzliche Pflicht zur Nutzung des
          Kontaktformulars besteht nicht.
        </p>
      </LegalSection>

      <LegalSection id="cookies" index="04" title="Cookies, Analyse und Werbetracking">
        <p>
          Diese Website setzt derzeit keine einwilligungspflichtigen Cookies ein. Wir
          verwenden keine Webanalyse-, Werbe- oder Retargeting-Dienste und erstellen keine
          Nutzerprofile.
        </p>
        <p>
          Sollten künftig entsprechende Technologien eingesetzt werden, wird diese
          Datenschutzerklärung vorab angepasst und – soweit gesetzlich erforderlich – eine
          Einwilligung eingeholt.
        </p>
      </LegalSection>

      <LegalSection id="schriftarten" index="05" title="Lokale Bereitstellung von Schriftarten">
        <p>
          Die auf dieser Website verwendeten Schriftarten werden lokal über unsere eigene
          Website-Infrastruktur ausgeliefert. Beim Seitenaufruf wird deshalb keine
          Verbindung zu Google Fonts oder einem anderen externen Schriftanbieter
          hergestellt.
        </p>
      </LegalSection>

      <LegalSection id="externe-links" index="06" title="Externe Links und Google Maps">
        <p>
          Die Website enthält Links zu externen Angeboten, unter anderem zu Google Maps.
          Eine Verbindung zum jeweiligen Anbieter wird erst hergestellt, wenn Sie den Link
          aktiv öffnen. Ab diesem Zeitpunkt verarbeitet der externe Anbieter Daten in
          eigener Verantwortung; dabei können insbesondere IP-Adresse, Geräteinformationen
          und der Zeitpunkt des Aufrufs übermittelt werden.
        </p>
      </LegalSection>

      <LegalSection id="empfaenger" index="07" title="Empfänger und Übermittlungen in Drittländer">
        <p>
          Personenbezogene Daten erhalten nur Stellen, die sie für die beschriebenen Zwecke
          benötigen. Dazu gehören insbesondere unser Hosting-Anbieter Vercel, unser
          E-Mail-Dienstleister IONOS sowie von uns beauftragte technische Dienstleister,
          soweit dies für Betrieb, Wartung oder Sicherheit erforderlich ist.
        </p>
        <p>
          Eine Übermittlung in Staaten außerhalb des Europäischen Wirtschaftsraums kann im
          Rahmen des Hostings durch Vercel stattfinden. Soweit erforderlich, erfolgt eine
          solche Übermittlung auf Grundlage der gesetzlichen Mechanismen der Art. 44 ff.
          DSGVO. Eine darüber hinausgehende Weitergabe erfolgt nur bei gesetzlicher
          Verpflichtung oder mit Ihrer Einwilligung.
        </p>
        <p>Eine automatisierte Entscheidungsfindung einschließlich Profiling findet nicht statt.</p>
      </LegalSection>

      <LegalSection id="speicherdauer" index="08" title="Speicherdauer">
        <p>
          Wir speichern personenbezogene Daten nur so lange, wie dies für den jeweiligen
          Zweck erforderlich ist. Server-Logdaten werden gelöscht, sobald sie für Betrieb
          und Sicherheit nicht mehr benötigt werden, sofern ein sicherheitsrelevantes
          Ereignis keine längere Aufbewahrung erfordert.
        </p>
        <p>
          Daten aus Anfragen werden gelöscht, wenn die Kommunikation abgeschlossen ist und
          keine gesetzlichen Aufbewahrungspflichten oder Rechtsansprüche entgegenstehen.
          Wird aus einer Anfrage ein Vertragsverhältnis, können handels- und
          steuerrechtliche Aufbewahrungsfristen gelten.
        </p>
      </LegalSection>

      <LegalSection id="rechte" index="09" title="Ihre Datenschutzrechte">
        <p>Im Rahmen der gesetzlichen Voraussetzungen haben Sie insbesondere das Recht auf:</p>
        <ul className="list-disc space-y-2 pl-5 marker:text-[#65733e]">
          <li>Auskunft über die von uns verarbeiteten personenbezogenen Daten,</li>
          <li>Berichtigung unrichtiger oder Vervollständigung unvollständiger Daten,</li>
          <li>Löschung oder Einschränkung der Verarbeitung,</li>
          <li>Widerspruch gegen eine Verarbeitung auf Grundlage berechtigter Interessen,</li>
          <li>Datenübertragbarkeit sowie</li>
          <li>Widerruf einer erteilten Einwilligung mit Wirkung für die Zukunft.</li>
        </ul>
        <p>
          Zur Ausübung Ihrer Rechte genügt eine Nachricht an{" "}
          <a className={legalLinkClass} href="mailto:hello@nexlytic.de">
            hello@nexlytic.de
          </a>
          . Die Rechtmäßigkeit der bis zum Widerruf erfolgten Verarbeitung bleibt
          unberührt.
        </p>
      </LegalSection>

      <LegalSection id="aufsicht" index="10" title="Beschwerderecht bei einer Aufsichtsbehörde">
        <p>
          Sie haben das Recht, sich bei einer Datenschutzaufsichtsbehörde zu beschweren. Für
          nichtöffentliche Stellen in Bayern ist insbesondere folgende Behörde zuständig:
        </p>
        <p>
          Bayerisches Landesamt für Datenschutzaufsicht (BayLDA)
          <br />
          Promenade 18
          <br />
          91522 Ansbach
          <br />
          <a
            className={legalLinkClass}
            href="https://www.lda.bayern.de/"
            target="_blank"
            rel="noopener noreferrer"
          >
            www.lda.bayern.de
          </a>
        </p>
      </LegalSection>

      <LegalSection id="sicherheit" index="11" title="Datensicherheit und Aktualisierung">
        <p>
          Diese Website nutzt eine verschlüsselte HTTPS-Verbindung. Wir setzen angemessene
          technische und organisatorische Maßnahmen ein, um personenbezogene Daten vor
          Verlust, Manipulation und unbefugtem Zugriff zu schützen.
        </p>
        <p>
          Wir passen diese Datenschutzerklärung an, wenn sich Funktionen, eingesetzte
          Dienstleister oder gesetzliche Anforderungen ändern. Es gilt die jeweils auf
          dieser Seite veröffentlichte Fassung.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
